self.addEventListener('message',function(evt){
    if(evt.data.type == 'calculate'){
        self.postMessage(calculate());
    }
},false)

//模拟一个大计算量的函数
function calculate(){
    let result = 0,i=0;
    while(i++< Math.pow(10,9)){
        result+= i;
    }
    return result;
}
