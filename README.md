#KOI-Business process flow

----

系统功能简述
==
----
名词定义
==
####User Agent
> 用户代理，如浏览器  
####Client
>客户端服务器，提供具体的业务实现。尽量使用RESTful风格搭建API。
#### Server
>Business Process Flow management server。包含一个完整的流程数据库、流程引擎和相关API。本文中如无特别指出，一般指KOI系统。
#### Process
>流程的定义，包含了相关的节点和逻辑。
#### Process Instance
>流程实例（流程运行时）
#### Process Parameter
>流程变量（流程运行时的上下文）
#### Activity
>流程节点的一种，和Client进行交互的唯一实体
#### Synchronizer
> <!--TODO -->
#### Completion
>KOI和client交互时主要的数据传输对象(详情见下)

---

Completion
===

---
	
运行流程
==

1. user agent向client发送启动流程request
    > 包含各种业务处理对象，如请假流程中的请假实体

2. client接收并处理获取到的数据，并向KOI发送创建流程request（
发送一个completion对象的序列化json）

	>该步骤中，客户端发出的HTTP请求包含以下参数：
	

3. KOI接受client发来的数据，并解析、创建流程，最终返回process instance id 给client（此时流程并没有启动）

4. client接收到process instance id ，将该id发送给KOI以启动该流程实例
	
	>该步骤中，客户端发出的HTTP请求包含以下参数：

5. KOI启动流程并根据process param 判断出下一Activity，并向client发送request。
	
	该步骤中，客户端发出的HTTP请求包含以下参数：

6. client根据Activity选择操作者，返回completion对象

7. KOI根据completion判断继续流程还是暂停。如继续流程，则返回第四步，否则继续

8. 用户通过user agent向clent发送继续流程request

9. client通过 `/complete` 方法向KOI发送流程继续request



 

