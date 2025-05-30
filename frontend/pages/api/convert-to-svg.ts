import type { NextApiRequest, NextApiResponse } from 'next'
import formidable from 'formidable'
import fs from 'fs/promises'
import path from 'path'
import potrace from 'potrace'
import sharp from 'sharp'
import { JSDOM } from 'jsdom'

export const config = {
  api: {
    bodyParser: false,
  },
}

async function safeUnlink(filepath: string) {
  try {
    await fs.unlink(filepath);
  } catch (error) {
    console.warn(`Warning: Failed to delete file ${filepath}:`, error);
  }
}

async function isSvgFile(filePath: string): Promise<boolean> {
  try {
    const fileContent = await fs.readFile(filePath, 'utf8');
    return fileContent.trim().startsWith('<svg');
  } catch (error) {
    console.error('Error reading file:', error);
    return false;
  }
}

async function processSvg(svgContent: string): Promise<string> {
  const dom = new JSDOM(svgContent, { contentType: "image/svg+xml" });
  const svgElement = dom.window.document.querySelector('svg');

  if (svgElement) {
    // Set viewBox if not present
    if (!svgElement.hasAttribute('viewBox')) {
      const width = svgElement.getAttribute('width') || '100';
      const height = svgElement.getAttribute('height') || '100';
      svgElement.setAttribute('viewBox', `0 0 ${width} ${height}`);
    }

    // Set width and height to 100%
    svgElement.setAttribute('width', '100%');
    svgElement.setAttribute('height', '100%');

    // Center the content if there's a single path or group
    const content = svgElement.querySelector('path, g');
    if (content && content instanceof dom.window.SVGGraphicsElement) {
      const bbox = content.getBBox();
      const viewBox = `${bbox.x} ${bbox.y} ${bbox.width} ${bbox.height}`;
      svgElement.setAttribute('viewBox', viewBox);
    }

    return dom.window.document.documentElement.outerHTML;
  }

  return svgContent; // Return original content if no SVG element found
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const tmpDir = path.join(process.cwd(), 'tmp');

  try {
    await fs.access(tmpDir);
  } catch {
    await fs.mkdir(tmpDir, { recursive: true });
  }

  const form = formidable({
    uploadDir: tmpDir,
    keepExtensions: true,
  });

  let originalFilePath: string | null = null;

  try {
    const [fields, files] = await form.parse(req);
    const fileArray = files.image;

    if (!fileArray || fileArray.length === 0) {
      return res.status(400).json({ error: 'No image file uploaded' })
    }

    const file = fileArray[0];
    
    if (!file.filepath) {
      return res.status(400).json({ error: 'Invalid file upload' })
    }

    originalFilePath = file.filepath;

    // Check if the uploaded file is already an SVG
    const isSvg = await isSvgFile(originalFilePath);

    let svg: string;

    if (isSvg) {
      // If it's an SVG, process it directly
      const svgContent = await fs.readFile(originalFilePath, 'utf8');
      svg = await processSvg(svgContent);
    } else {
      // If it's not an SVG, convert it as before
      const buffer = await sharp(file.filepath)
        .resize(500, 300, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
        .png()
        .toBuffer();

      svg = await new Promise<string>((resolve, reject) => {
        potrace.trace(buffer, {
          threshold: 128,
          turdSize: 2,
          optTolerance: 0.1,
          color: '#000000',
          background: '#ffffff',
          blackOnWhite: true,
        }, (err, svg) => {
          if (err) reject(err)
          else resolve(svg)
        })
      })

      // Process the generated SVG
      svg = await processSvg(svg);
    }

    res.status(200).json({ svg: svg })
  } catch (error) {
    console.error('Error processing image:', error)
    res.status(500).json({ error: 'Error processing image' })
  } finally {
    // Clean up temporary files
    if (originalFilePath) {
      try {
        await safeUnlink(originalFilePath);
      } catch (error) {
        console.error('Error deleting temporary file:', error);
      }
    }
  }
}