<a name="YovtD"></a>
# @rinkuto/koishi-plugin-chatgpt
<a name="TArcP"></a>
## [![npm](https://img.shields.io/npm/v/@rinkuto/koishi-plugin-chatgpt?style=flat-square)](https://www.npmjs.com/package/@rinkuto/koishi-plugin-chatgpt) [![npm](https://img.shields.io/npm/dt/@rinkuto/koishi-plugin-chatgpt?style=flat-square)](https://www.npmjs.com/package/@rinkuto/koishi-plugin-chatgpt)
![image.png](https://cdn.nlark.com/yuque/0/2023/png/32674329/1678098437827-f2c95a7c-cb72-4525-9257-287504d5623e.png#averageHue=%23e2e0df&clientId=uc8020153-7403-4&from=paste&height=344&id=ucc0c2bbd&name=image.png&originHeight=424&originWidth=766&originalType=binary&ratio=1.2395833730697632&rotation=0&showTitle=false&size=48366&status=done&style=none&taskId=u83b97194-f85f-4614-b14a-900aa154b1a&title=&width=621.9369506835938)
<a name="HdvfI"></a>
## 机器人回复的几种情况

1. 正在私聊
2. @机器人
3. 聊天内容中包含了机器人的名字
4. 群聊中机器人会随机回复
   <a name="ItKPc"></a>
## 祝玩的开心。
<a name="ekhnX"></a>
<br/>
<br/>
# 配置

<a name="OfauW"></a>
## ChatGPT 配置
<a name="qvL2x"></a>
### apiKey*

- Type: `String`
- 必填

[Open AI](https://platform.openai.com/account/api-keys)的$apiKey$。
<a name="tmrSs"></a>
### isProxy

- Type: `Boolean`
- Default: `false`

是否启动代理。
<a name="Nb18X"></a>
### isEnv

- Type: `Boolean`
- Default: `false`

代理是否修改环境变量，当`isProxy`为`true`时会将`HTTP_PROXY`等环境变量修改。
<a name="Ca5LO"></a>
### proxyHost

- Type: `String`
- Default: `http://127.0.0.1:7890`

代理服务器地址，仅在`isProxy`为`true`时才有效，更多关于代理的问题请看<a href="#proxy">关于代理</a>。

<a name="s8DRE"></a>
<br/>
## 机器人 配置
<a name="CfkOj"></a>
### botName

- Type: `String`

机器人的名字。
<a name="CWgRy"></a>
### selfIntroduction

- Type: `String`

机器人的自我介绍，用来调教Chat GPT，不宜太长，不然会消耗大量的$Token$。
<a name="NbKg6"></a>
### sampleDialog

- Type: `Dict<string, string>`

与机器人的示例对话，用来调教Chat GPT，不宜太长，不然会消耗大量的$Token$。
<a name="dJBTZ"></a>
<br/>
## 回复 配置
<a name="KgSE1"></a>
### maxTokens

- Type: `Number`
- Default: `128`

生成的回复允许的最大$Token$数。
<a name="JjljP"></a>
### temperature

- Type: `Number`
- Default: `0.8`

回复的温度，介于$0$和$2$之间，较高的值（如 $0.8$）将使输出更加随机，而较低的值（如 $0.2$）将使其更加集中和确定。
<a name="iWkXP"></a>
### presencePenalty

- Type: `Number`
- Default: `0`

回复的词频惩罚，介于$-2$和$2$之间。设置为 $-2$，则模型将生成更简单、更可预测的文本。如果将其设置为 $2$，则模型将生成更加复杂、不可预测的文本。会根据新 Tokens 在文本中的现有频率对其进行惩罚，从而降低模型逐字重复同一行的可能性（以恐怖故事为例）<br />= $-2.0$：当早上黎明时，我发现我家现在现在现在现在现在现在现在现在现在现在现在现在现在现在现在现在现在现在现在现在现在现在现在现在现在现在现在现在现在现在现在现在现在现在现在现在现在现在现在现在现在现在（频率最高字符是 “现”，占比 $44.79\%$）<br />= $-1.0$：他总是在清晨漫步在一片森林里，每次漫游每次每次游游游游游游游游游游游游游游游游游游游游游游游游游游游游游（频率最高字符是 “游”，占比 57.69%）<br />= $0.0$：当一道阴森的风吹过早晨的小餐馆时，一个被吓得发抖的人突然出现在门口，他的嘴唇上挂满血迹，害怕的店主决定给他一份早餐，却发现他的早餐里满是血渍。（频率最高字符是 “的”，占比 $8.45\%$）<br />= $1.0$：一个熟睡的女孩被一阵清冷的风吹得不由自主地醒了，她看到了早上还未到来的黑暗，周围只有像诉说厄运般狂风呼啸而过。（频率最高字符是 “的”，占比 $5.45\%$）<br />= $2.0$：每天早上，他都会在露台上坐着吃早餐。柔和的夕阳照耀下，一切看起来安详寂静。但是有一天，当他准备端起早食的时候发现胡同里清冷的风扑进了他的意识中并带来了不安全感…… （频率最高字符是 “的”，占比 $4.94\%$）
<a name="ddMuj"></a>
### frequencyPenalty

- Type: `Number`
- Default: `0`

回复的存在惩罚，介于$-2$和$2$之间。设置为$-2$，则模型将生成更简单、更可预测的文本。如果将其设置为 $2$，则模型将生成更加复杂、不可预测的文本。会根据到目前为止是否出现在文本中来惩罚新 $Tokens$，从而增加模型谈论新主题的可能性（以云课堂的广告文案为例）<br />= $-2.0$：家长们，你们是否为家里的孩子学业的发展而发愁？担心他们的学习没有取得有效的提高？那么，你们可以放心，可以尝试云课堂！它是一个为从幼儿园到高中的学生提供的一个网络平台，可以有效的帮助孩子们提高学习效率，提升学习成绩，帮助他们在学校表现出色！让孩子们的学业发展更加顺利，家长们赶紧加入吧！（抓住一个主题使劲谈论）<br />= $-1.0$：家长们，你们是否还在为孩子的学习成绩担忧？云课堂给你们带来了一个绝佳的解决方案！我们为孩子提供了专业的学习指导，从幼儿园到高中，我们都能帮助孩子们在学校取得更好的成绩！让孩子们在学习中更轻松，更有成就感！加入我们，让孩子们拥有更好的学习体验！（紧密围绕一个主题谈论）<br />= $0.0$：家长们，你们是否担心孩子在学校表现不佳？云课堂将帮助您的孩子更好地学习！云课堂是一个网络平台，为从幼儿园到高中的学生提供了全面的学习资源，让他们可以在学校表现出色！让您的孩子更加聪明，让他们在学校取得更好的成绩，快来云课堂吧！（相对围绕一个主题谈论）<br />= $1.0$：家长们，你们的孩子梦想成为最优秀的学生吗？云课堂就是你们的答案！它不仅可以帮助孩子在学校表现出色，还能够提供专业教育资源，助力孩子取得更好的成绩！让你们的孩子一路走向成功，就用云课堂！（避免一个主题谈论的太多）<br />= $2.0$：家长们，您有没有想过，让孩子在学校表现出色可不是一件容易的事？没关系！我们为您提供了一个优质的网络平台——云课堂！无论您的孩子是小学生、初中生还是高中生，都能够通过云课堂找到最合适的学习方法，帮助他们在学校取得优异成绩。快来体验吧！（最大程度避免谈论重复的主题）
<a name="fNYnm"></a>
### replyRate

- Type: `Number`
- Default: `0.1`

群聊时被机器人随机回复的概率。
<a name="JXy4x"></a>
### maxMemoryLength

- Type: `Number`
- Default: `5`

能记住的确切对话轮数，一问一答算一轮对话，不宜太高，会消耗大量$Token$。
<a name="PzyDN"></a>
### fuzzyMemoryLength

- Type: `Number`
- Default: `15`

能记住的模糊对话轮数，一问一答算一轮对话，不宜太高，会消耗大量$Token$。

<a name="fhOFz"></a>
<br/>
## 日志 配置
<a name="nR7gY"></a>
### isLog

- Type: `Boolean`
- Default: `false`

是否向控制台输出日志

<a name="LtnSh"></a>
<br/>
# 命令
<a name="JuHPr"></a>
## reset

- alias 重置

重置机器人关于你的记忆。

## balance


- alias 余额

查询Open Api的余额。


<a id="proxy"></a>
# 关于代理
这个方法在`Win 10`和`Centos 7`上使用是成功的，此插件设置代理是通过`process.env`设置环境变量`HTTP_PROXY`和`HTTPS_PROXY`完成。当`isProxy`为`true`，且`isEnv`为`true`时，才会修改环境变量，若`isProxy`为`true`，且`isEnv`为`false`时，则会通过`AxiosRequestConfig`设置代理服务器。<br />Clash的端口默认是$7890$，因此代理服务器的地址为`http://127.0.0.1:7890`。~~如果是桌面应用程序，或许得将代理服务器的地址设置为~~`~~socks://127.0.0.1:7890~~`~~，同时开启TUN模式??~~。

