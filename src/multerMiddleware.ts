import multer from  'multer'
export const upload = multer({
    storage: multer.diskStorage({
        destination: (_,__, next)=> {
            
            next(null, 'images/')
        },
        filename: (_,file, next)=> {
            const ext = file.mimetype.split('/')[1]
            next(null, file.originalname.split('.'+ext)[0] +'-'+Date.now()+ '.' +ext)
        }
    }),
    fileFilter: (_,file, next) => {
        
        if(!file){
            next(new Error('No file Provided'))
        }
        const image = file.mimetype.startsWith('image/')
        if(image) {
            next(null, true)
        }else{
            next(null, false)
        }
    },
})