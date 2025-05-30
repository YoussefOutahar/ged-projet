def chunk_data(data, chunk_size):
    """Split data into chunks of specified size."""
    for i in range(0, len(data), chunk_size):
        yield data[i:i + chunk_size]