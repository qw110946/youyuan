//测试数据
// let data = [
//     {name:'01测试题目1',answer:[{name:'正确答案1',right:'1'},{name:'错误答案2',right:'0'},{name:'错误答案3',right:'0'}, {name:'错误答案4', right:'0'}]},
//     {name:'02测试题目1',answer:[{name:'正确答案1',right:'1'},{name:'错误答案2',right:'0'},{name:'错误答案3',right:'0'}, {name:'错误答案4', right:'0'}]}
// ];

// 这个变量用于渲染第几轮问题
let number = 0;
//答案的数组 有选择答案就放进去，没有选择就不放 1是正确 0是错误的答案
let answer = [];

window.onload = function() {
    timerStart(number);
};

/**
 * 启动计时器
 * @param number 第几轮问题
 */
timerStart = (number)=> {
    let countdown = 15;
    let content = `<div class='title'>${data[number].name}`;
    for(let i in data[number].answer){
        content += `<button onclick="choose(this)" data-info=${data[0].answer[i].right}>${data[0].answer[i].name}`
    }
    content += '</button><div class="countdown"></div></div>';
    $('.main')[0].innerHTML = content;
    let timer = setInterval(function(){

        $('.countdown')[0].innerHTML = `<div>${countdown}</div>`;

        if(countdown === 0) {
            for(let i=0; i < $('button').length; i++) {
                // console.log($('button')[i].style.background);
                if($('button')[i].style.background == 'red') {
                    answer.push($('button')[i].dataset.info);
                }
            }

            clearInterval(timer);
            number++;
            if(number >= 2) {
                $('.main')[0].innerHTML = '<div>答题结束，请提交答案</div><button onclick="Submit()">提交答案</button>';

                return;
            }
            //重启计时器
            timerStart(number);
        }
        countdown--;

        // console.log(countdown);
    },20000000)
};

/**
 * 选择答案
 * @param _this 点击选择的答案
 */
choose = (_this) => {
    for(let i=0; i < $('button').length; i++) {
        $('button')[i].style.background = '';
    }
    _this.style.background = 'red';
    // answer.push(_this.dataset.info);
};
// 提交答案
Submit = () => {
    //data变量用于判断 正确答案有几个，正确就增加 否则不做操作
    let data = 0;
    for(let i in answer) {
        if(answer[i] == 1) {
            data++;
        }
    }
    // correct_num 10
    window.location = '/pro/youyuan/submitAnwer?id=' + '111' + '&' + 'anwser=' + data;
};