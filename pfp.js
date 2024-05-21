let albumBucketName = 'profilephotosprestonkwei'
let bucketRegion = 'us-east-2'
let IdentityPoolId = 'us-east-2:6fd6c7b7-1634-44d1-8e08-62c5eb12f108'

AWS.config.update({
  region: bucketRegion,
  credentials: new AWS.CognitoIdentityCredentials({
    IdentityPoolId: IdentityPoolId,
  }),
})
let photoid = ''
let s3 = new AWS.S3({
  apiVersion: '2006-03-01',
  params: { Bucket: albumBucketName },
})
function addPhoto() {
  let files = document.getElementById('pfpup').files
  if (!files.length) {
    return alert('Please choose a file to upload first.')
  }
  let file = files[0]
  let id = self.crypto.randomUUID()
  photoid = id
  let upload = new AWS.S3.ManagedUpload({
    params: {
      Bucket: albumBucketName,
      Key: `pfp-${id}.png`,
      Body: file,
      ContentType: 'image/png',
    },
  })

  let promise = upload.promise()

  promise.then(
    function (data) {
      alert('Successfully uploaded photo.')
    },
    function (err) {
      console.log(err)
      return alert('There was an error uploading your photo: ', err.message)
    }
  )
}

document.querySelector('#pfpup').addEventListener('change', () => {
  console.log('PFP UPLOADED')
  addPhoto()
  // Ensure photoid is used correctly in the URL.
  document.querySelector('#temppfpbox').innerHTML = `<img src='https://profilephotosprestonkwei.s3.us-east-2.amazonaws.com/pfp-${photoid}.png'>`
})