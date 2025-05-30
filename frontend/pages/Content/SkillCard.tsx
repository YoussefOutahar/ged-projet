import React from 'react'

const SkillCard = (props:any) => {
  return (
    <div style={{ display: 'flex', alignItems: 'end' ,justifyContent: 'space-between' , width:"80%", marginLeft:'100px'}}>
        <h3 className='text-base' style={{ margin: '0' }}>{props.title}</h3>
        <div style={{ marginLeft: '8px',flex: '1'}}>
            <h3 className='text-sm' style={{textAlign:'end',margin: 5}}>{props.val}</h3>
            <div style={{width:'100%', backgroundColor:"#bdbbbb",borderRadius: '9999px' , marginTop: '14px',height: '8px'  }}>
                <div style={{backgroundColor:'#587cba', width:props.width, height:'100%', borderRadius: '9999px'}}></div>
            </div>
        </div>
    </div>
  )
}

export default SkillCard