let img = 'https://res.cloudinary.com/daqs7x8my/image/upload/v1601181173/qpywcbibudihyg9k42yg.jpg'
img = img.split('/');
img.splice(6, 0, 'w_100,h_100,c_thumb,g_face')
img = img.join('/')