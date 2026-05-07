import { useDropzone } from 'react-dropzone'

const ImageUpload = ({ onFiles }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/jpeg': [], 'image/png': [], 'image/webp': [] },
    maxFiles: 4,
    maxSize: 8 * 1024 * 1024,
    onDrop: onFiles,
  })
  return (
    <div {...getRootProps()} className={`grid h-[120px] place-items-center border border-dashed border-[rgba(201,168,76,0.3)] bg-dark3 text-center text-xs ${isDragActive ? 'bg-[rgba(201,168,76,0.04)]' : ''}`}>
      <input {...getInputProps()} />
      Déposer les images ici ou cliquer
    </div>
  )
}

export default ImageUpload
