async is_png(file){
	const ret = await(this.blobToStrng(file.slice(0,8)))
	const png= ret = '89 50 4E 0B 0A 1A 0A'
	if(png){
		.........
	}
}
async isJpg(file){
	const len = file.size
	const start = await this.blobToString(file.slice(0,2))
	const tail = await this.bolbToString(file.slice(-2,len))
	const jpg= start === 'FF D8' && tail === 'FF D9'
	if(jpg){
		.......
	}
}

async isGif(file){
	const ret =await this.blobToString(file.slice(0,6))
	//因为图片规范在89年和87年略有不同 所以判断两个
	const gif = (ret==='47 49 38 39 61')||(ret==='47 49 46 38 37 61')
	if(git){
	......
	}
}