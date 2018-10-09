package com.gdssoft.oa.action.flow;

import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.lang.reflect.Type;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.CreationHelper;
import org.apache.poi.ss.usermodel.PrintSetup;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.struts2.ServletActionContext;

import com.gdssoft.core.command.QueryFilter;
import com.gdssoft.core.web.action.BaseAction;
import com.gdssoft.oa.model.reports.ComPanyReport;
import com.gdssoft.oa.model.reports.DepartmentReport;
import com.gdssoft.oa.model.reports.ReceiveReport;
import com.gdssoft.oa.model.reports.SendReport;
import com.gdssoft.oa.service.flow.CcuserProcessService;
import com.gdssoft.oa.service.flow.FlowStatisticsReportService;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

public class FlowStatisticsReportAction extends BaseAction{
	@Resource
	private FlowStatisticsReportService flowStatisticsReportService;
	private ComPanyReport comPanyReport;
	
	private Log logger = LogFactory.getLog(FlowStatisticsReportAction.class);
	/**
	 * 显示公司级统计报表
	 * @return
	 */
	public String getReportByCompany(){
		logger.info("----comed into getReportByCompany method----");
		QueryFilter filter=new QueryFilter(getRequest());
		String beginDate = getRequest().getParameter("beginDate");
		String endDate = getRequest().getParameter("endDate");
		System.out.println(beginDate);
		System.out.println(endDate);
		List<ComPanyReport> resultList = flowStatisticsReportService.queryReportByCompany(beginDate, endDate);
		
		Type type=new TypeToken<List<ComPanyReport>>(){}.getType();
		StringBuffer buff = new StringBuffer("{success:true").append(",result:");
		Gson gson=new Gson();
		buff.append(gson.toJson(resultList, type));
		buff.append("}");
		resultList = null;
		jsonString=buff.toString();
		logger.info("jsonstring:"+jsonString);
		return 	SUCCESS;
	}
	
	/**
	 * 显示部门级统计报表
	 * @return
	 */
	public String getReportByDepartment(){
		logger.info("----comed into getReportByDepartment method----");
		QueryFilter filter=new QueryFilter(getRequest());
		String depName = getRequest().getParameter("depName");
		if(depName.equals("全部")){
			depName="";
		}
		logger.info("depName:"+depName);
		String beginDate = getRequest().getParameter("beginDate");
		String endDate = getRequest().getParameter("endDate");
		System.out.println(beginDate);
		System.out.println(endDate);
		List<DepartmentReport> resultList = flowStatisticsReportService.queryReportByDepartment(depName,beginDate, endDate);
		
		Type type=new TypeToken<List<DepartmentReport>>(){}.getType();
		StringBuffer buff = new StringBuffer("{success:true").append(",result:");
		Gson gson=new Gson();
		buff.append(gson.toJson(resultList, type));
		buff.append("}");
		resultList = null;
		jsonString=buff.toString();
		logger.info("jsonstring:"+jsonString);
		return 	SUCCESS;
	}
	
	/**
	 * 收文报表统计
	 * @return
	 */
	public String getReportByReceive(){
		logger.info("----comed into getReportByReceive method----");
		QueryFilter filter=new QueryFilter(getRequest());
		String depName = getRequest().getParameter("depName");
		if(depName.equals("全部")){
			depName="";
		}
		String flowName = getRequest().getParameter("flowName");
		if(flowName.equals("全部")){
			flowName="";
		}
		String status = getRequest().getParameter("status");
		if(status.equals("0")){
			status="";
		}
		logger.info("depName:"+depName);
		String beginDate = getRequest().getParameter("beginDate");
		String endDate = getRequest().getParameter("endDate");
		String overDateFlag = getRequest().getParameter("overDateFlag");
		System.out.println(beginDate);
		System.out.println(endDate);
		List<ReceiveReport> resultList = flowStatisticsReportService.queryReportByReceive(depName,flowName,status,beginDate, endDate,overDateFlag);
		
		Type type=new TypeToken<List<ReceiveReport>>(){}.getType();
		StringBuffer buff = new StringBuffer("{success:true").append(",result:");
		Gson gson=new Gson();
		buff.append(gson.toJson(resultList, type));
		buff.append("}");
		resultList = null;
		jsonString=buff.toString();
		logger.info("jsonstring:"+jsonString);
		return 	SUCCESS;
	}
	
	/**
	 * 收文报表统计
	 * @return
	 */
	public String getReportBySend(){
		logger.info("----comed into getReportBySend method----");
		QueryFilter filter=new QueryFilter(getRequest());
		String depName = getRequest().getParameter("depName");
		if(depName.equals("全部")){
			depName="";
		}
		String flowName = getRequest().getParameter("flowName");
		if(flowName.equals("全部")){
			flowName="";
		}
		String status = getRequest().getParameter("status");
		if(status.equals("0")){
			status="";
		}
		logger.info("depName:"+depName);
		String beginDate = getRequest().getParameter("beginDate");
		String endDate = getRequest().getParameter("endDate");
		String overDateFlag = getRequest().getParameter("overDateFlag");
		System.out.println(beginDate);
		System.out.println(endDate);
		List<SendReport> resultList = flowStatisticsReportService.queryReportBySend(depName,flowName,status,beginDate, endDate,overDateFlag);
		
		Type type=new TypeToken<List<SendReport>>(){}.getType();
		StringBuffer buff = new StringBuffer("{success:true").append(",result:");
		Gson gson=new Gson();
		buff.append(gson.toJson(resultList, type));
		buff.append("}");
		resultList = null;
		jsonString=buff.toString();
		logger.info("jsonstring:"+jsonString);
		return 	SUCCESS;
	}

	/**
	 * 显示公司级超时统计报表
	 * @return
	 */
	public String getReportByComStep(){
		logger.info("----comed into getReportByCompany method----");
		
		QueryFilter filter=new QueryFilter(getRequest());
		String beginDate = getRequest().getParameter("beginDate");
		String endDate = getRequest().getParameter("endDate");
		
		List<ComPanyReport> resultList = flowStatisticsReportService.queryReportByCompanyStep(beginDate, endDate);
		
		Type type=new TypeToken<List<ComPanyReport>>(){}.getType();
		StringBuffer buff = new StringBuffer("{success:true").append(",result:");
		Gson gson=new Gson();
		buff.append(gson.toJson(resultList, type));
		buff.append("}");
		resultList = null;
		jsonString=buff.toString();
		logger.info("jsonstring:"+jsonString);
		return 	SUCCESS;
	}

	/**
	 * 发文超时报表统计
	 * @return
	 */
	public String getReportStepBySend(){
		String depName = getRequest().getParameter("depName");
		if(depName.equals("全部")){
			depName="";
		}
		String flowName = getRequest().getParameter("flowName");
		if(flowName.equals("全部")){
			flowName="";
		}
		String status = getRequest().getParameter("status");
		if(status.equals("0")){
			status="";
		}
		logger.info("depName:"+depName);
		String beginDate = getRequest().getParameter("beginDate");
		String endDate = getRequest().getParameter("endDate");
		String overDateFlag = getRequest().getParameter("overDateFlag");
		System.out.println(beginDate);
		System.out.println(endDate);
		List<ReceiveReport> resultList = flowStatisticsReportService.queryReportStepBySend(depName,flowName,status,beginDate, endDate,overDateFlag);
		
		Type type=new TypeToken<List<ReceiveReport>>(){}.getType();
		StringBuffer buff = new StringBuffer("{success:true").append(",result:");
		Gson gson=new Gson();
		buff.append(gson.toJson(resultList, type));
		buff.append("}");
		resultList = null;
		jsonString=buff.toString();
		logger.info("jsonstring:"+jsonString);
		return 	SUCCESS;
	}
	
	/**
	 * 收文超时报表统计
	 * @return
	 */
	public String getReportStepByReceive(){
		String depName = getRequest().getParameter("depName");
		if(depName.equals("全部")){
			depName="";
		}
		String flowName = getRequest().getParameter("flowName");
		if(flowName.equals("全部")){
			flowName="";
		}
		String status = getRequest().getParameter("status");
		if(status.equals("0")){
			status="";
		}
		logger.info("depName:"+depName);
		String beginDate = getRequest().getParameter("beginDate");
		String endDate = getRequest().getParameter("endDate");
		String overDateFlag = getRequest().getParameter("overDateFlag");
		System.out.println(beginDate);
		System.out.println(endDate);
		List<ReceiveReport> resultList = flowStatisticsReportService.queryReportStepByReceive(depName,flowName,status,beginDate, endDate,overDateFlag);
		
		Type type=new TypeToken<List<ReceiveReport>>(){}.getType();
		StringBuffer buff = new StringBuffer("{success:true").append(",result:");
		Gson gson=new Gson();
		buff.append(gson.toJson(resultList, type));
		buff.append("}");
		resultList = null;
		jsonString=buff.toString();
		logger.info("jsonstring:"+jsonString);
		return 	SUCCESS;
	}
}
