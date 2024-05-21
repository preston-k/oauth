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
      const event = new CustomEvent('sendpfp', {
        detail: id,
      })
      document.dispatchEvent(event)
    },
    function (err) {
      console.log(err)
      return alert(
        'Sorry, we ran into an error uploading your profile photo.\n\nRef: ',
        err.message
      )
    }
  )
}

document.querySelector('#pfpup').addEventListener('change', () => {
  document.querySelector('#loaddivparent').style.display = 'flex'
  addPhoto()
})
