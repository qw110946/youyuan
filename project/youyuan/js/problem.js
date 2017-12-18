//测试数据
// let data = [
//     {name:'01测试题目1',answer:[{name:'正确答案1',right:'1'},{name:'错误答案2',right:'0'},{name:'错误答案3',right:'0'}, {name:'错误答案4', right:'0'}]},
//     {name:'02测试题目1',answer:[{name:'正确答案001',right:'1'},{name:'错误答案2',right:'0'},{name:'错误答案3',right:'0'}, {name:'错误答案4', right:'0'}]}
// ];
let number = 0;// 这个变量用于渲染第几轮问题


//答案的数组 有选择答案就放进去，没有选择就不放 1是正确 0是错误的答案
let answer = [];

window.onload = function() {
    //把数组的answer转换一下格式
    for(let i = 0; i < data.length; i++) {
        data[i].answer = JSON.parse(data[i].answer)
    }
};

// 开始答题
let start = () => {
    $('.main')[0].style.display = 'block';
    $('.start')[0].style.display = 'none';
    timerStart(number);
};

/**
 * 启动计时器
 * @param number 第几轮问题
 */
let timerStart = (number) => {
    let countdown = 15;//倒计时

    $(".subject p")[0].innerHTML = data[number].name;
    $(".text p")[0].innerHTML = `倒计时：${countdown}秒`;
    let content = '';

    for(let i = 0; i < 4; i ++) {
        content += `<div class="answer"><button onclick="choose(this)" data-info=${data[0].answer[i].right} >${data[number].answer[i].name}</button></div>`;
    }
    $('.problem')[0].innerHTML = content;

    //下一题
    next = () => {
        $('.loading')[0].style.display = 'block';
        $('.main')[0].style.display = 'none';
        countdown = 0;
        setTimeout(() => {
            $('.loading')[0].style.display = 'none';
            $('.main')[0].style.display = 'block';
        }, 1000)
    };

    // 启动计时器
    let timer = setInterval(() => {
        $(".text p")[0].innerHTML = `倒计时：${countdown}秒`;

        if(countdown === 0) {
            for(let i = 0; i < $(".answer button").length; i++) {
                // console.log($('button')[i].style.background);
                if($(".answer button")[i].style.background == 'rgb(174, 30, 38)') {
                    answer.push($(".answer button")[i].dataset.info);
                    $('.problem')[0].innerHTML = '';
                }
            }

            clearInterval(timer);
            number++;
            if(number >= 10) {
                let temp_01 = 0;
                let second = 5;
                for(let i in answer) {
                    if(answer[i] == 'true') {
                        temp_01++;
                    }
                }
                let temp_02 = (temp_01/10) * 100 + '%';
                $('.main')[0].innerHTML = `<div class="determine"><p>你的答题正确率:${temp_02}</p><p>五秒后自动跳转提交答案</p><span>${second}</span></div>`;

                let timer = setInterval(() => {
                    second--;
                    $('.determine span')[0].innerHTML = second;
                    if(second == 0) {
                        clearInterval(timer);
                        window.location = '/pro/youyuan/submitAnswer?correct_num=' + temp_01;
                    }
                },1000);

                // $('.main')[0].innerHTML = '<div class="next" onclick="Submit()">\n' +
                //     '            <div class="sign">\n' +
                //     '                <img src="/pro/youyuan/image/materal_02.png" alt="">\n' +
                //     '                <p>提交答案</p>\n' +
                //     '            </div>\n' +
                //     '        </div>';

                return;
            }
            //重启计时器
            timerStart(number);
        }
        countdown--;

        // console.log(countdown);
    },1000)

};

determine = () => {

};

/**
 * 选择答案
 * @param _this 点击选择的答案
 */
choose = (_this) => {
    for(let i=0; i < $(".answer button").length; i++) {
        $(".answer button")[i].style.background = '';
        $(".answer button")[i].style.color = '#000';
    }
    _this.style.background = '#ae1e26';
    _this.style.color = '#fff';
    // answer.push(_this.dataset.info);
};
// 提交答案
Submit = () => {
    //data变量用于判断 正确答案有几个，正确就增加 否则不做操作
    let data = 0;
    for(let i in answer) {
        if(answer[i] == 'true') {
            data++;
        }
    }
    window.location = '/pro/youyuan/submitAnswer?correct_num=' + data;
};