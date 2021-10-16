import COS from "cos-js-sdk-v5"
// import store from "../store"
export default  function uploadFile(file,callBack){
    // let ext = file.name.slice(file.name.indexOf("."))
    // let name = "/" + store.state.user.agent + '/'+ file.name
    let name = '/1'+'/'+ file.name
    const cos = new COS({
        // 必选参数
        SecretId: 'AKIDMoGqHmbUaUHxR8rEc1FIBsZ4Yr18q4oX',
        SecretKey: '1ucDg8Rlz1sWyEvRo3V5UkbO0b2GUWpj',
    })
    cos.putObject({
        Bucket: 'jinpu-1257334471', /* 必须 */
        Region:'ap-shanghai',
        Key:name,
        StorageClass: 'STANDARD',
        Body: file, // 上传文件对象
        onProgress: function(progressData) {
//             console.log(JSON.stringify(progressData));
        }
    }, function(err, data) {
//         console.log(err || data);
        callBack(data.Location)
     })
}