package com.gdssoft.oa.service.flow;

import java.io.IOException;
import java.io.StringReader;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.apache.commons.digester.Digester;
import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.DocumentHelper;
import org.dom4j.Element;
import org.xml.sax.SAXException;

import com.gdssoft.core.util.DateUtil;
import com.gdssoft.oa.service.point.ToDoBean;
import com.gdssoft.oa.service.point.ToDoListResp;

/**
 * 
 * 解析上传超速车辆记录 xml 用于调用执法系统接口
 * 
 * @author F3222507
 * 
 */
public class ToDoListRespXml {

	/**
	 * 解析返回结果
	 * 
	 * @param responseXml
	 * @return
	 * @throws IOException
	 * @throws SAXException
	 */
	public static ToDoListResp parseResponseXml(String responseXml)
			throws IOException, SAXException {
		//获取要解析的xml
		StringReader read = new StringReader(responseXml);
		Digester digester = new Digester();
		digester.setValidating(false);

		digester.addObjectCreate("todolist", "com.gdssoft.oa.service.point.ToDoListResp");
		digester.addSetProperties("todolist");
		digester.addObjectCreate("todolist/todo", "com.gdssoft.oa.service.point.ToDoBean");
		digester.addSetProperties("todolist/todo");
		digester.addSetNext("todolist/todo", "addToDoBean", "com.gdssoft.oa.service.point.ToDoBean");

		// 解析xmlDoc
		ToDoListResp toDoListResp = (ToDoListResp) digester.parse(read);
		return toDoListResp;

	}

	public static void main(String[] args) throws IOException, SAXException {
		String xml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>"
				+ "<todolist totlecount=\"68\" resultcount=\"2\">"
				+ "<todo title=\"測試人員同志的的新闻申请待审批\" date=\"2011-05-18 06:46:53\" link=\"http://localhost:8080/SZ_Metro3_OA/index.jsp?viewId=NewsView\" />"
				+ "<todo title=\"超级管理员同志的的新闻申请待审批\" date=\"2011-05-23 00:58:28\" link=\"http://localhost:8080/SZ_Metro3_OA/index.jsp?viewId=NewsView\" />"
				+ "</todolist>";
		ToDoListResp library = (ToDoListResp) ToDoListRespXml
				.parseResponseXml(xml);
		System.out.println(DateUtil.parseDate("2011-05-31 09:18:40"));
	}

}
