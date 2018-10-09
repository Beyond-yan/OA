package com.gdssoft.oa.service.communicate.impl;

import com.gdssoft.oa.service.communicate.PortalTodoService;

/**
 * @author F3222507
 *
 */
public class PortalTodoServiceImpl implements PortalTodoService {

	@Override
	public String addToDo() {
		// TODO Auto-generated method stub
		return null;
	}
	
	//测试代码
	/*public static void main(String[] args) {
		// TODO Auto-generated method stub
		System.out.println("main function start");
		try {
			// 服务端的url，需要根据情况更改。   
			String endpointURL = "http://web.szmtr.com.cn/szgx-mtr3-todo-portlet/services/todo.jws?wsdl";   
			Service service = new Service();
			Call call = (Call)service.createCall();
			call.setTargetEndpointAddress(new java.net.URL(endpointURL));
			call.setOperationName("addToDo");// 设置操作的名称。
			
			call.addParameter("typeID", XMLType.XSD_STRING, ParameterMode.IN);// 参数的类型   
			call.addParameter("empId", XMLType.XSD_STRING, ParameterMode.IN);// 参数的类型   
			call.addParameter("title", XMLType.XSD_STRING, ParameterMode.IN);// 参数的类型   
			call.addParameter("subject", XMLType.XSD_STRING, ParameterMode.IN);// 参数的类型   
			call.addParameter("level", XMLType.XSD_STRING, ParameterMode.IN);// 参数的类型   
			call.addParameter("doLink", XMLType.XSD_STRING, ParameterMode.IN);// 参数的类型   
			call.addParameter("enabledate", XMLType.XSD_STRING, ParameterMode.IN);// 参数的类型   
			call.addParameter("disabledate", XMLType.XSD_STRING, ParameterMode.IN);// 参数的类型   
			
			call.setReturnType(XMLType.XSD_STRING);// 返回的数据类型
			
			// 设置账号密码
			call.getMessageContext().setUsername("serviceuser");
			call.getMessageContext().setPassword("Foxconn88");
			
			String ret = (String)call.invoke(new Object[] {"1","L30001","testtitle2","testsubject2","","","",""});// 执行调用   
			System.out.println(ret);
		} catch(Exception e) {
			e.printStackTrace();
		}
		System.out.println("main function end");
		System.exit(0);
	}*/


}
