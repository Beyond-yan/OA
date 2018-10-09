package com.gdssoft.oa.service.flow;

import java.io.InputStream;
import java.util.List;

import com.gdssoft.core.service.BaseService;
import com.gdssoft.oa.model.reports.ComPanyReport;
import com.gdssoft.oa.model.reports.DepartmentReport;
import com.gdssoft.oa.model.reports.ReceiveReport;
import com.gdssoft.oa.model.reports.SendReport;
/**
 * 流程统计分析 报表
 * @author F3222507
 *
 */
public interface FlowStatisticsReportService extends BaseService<ComPanyReport>{
	/**
	 * 
	 * @param beginDate 开始日期
	 * @param endDate 结束日期
	 * @return 查询结果
	 */
	public  List<ComPanyReport>  queryReportByCompany(String beginDate,String endDate);
	
	/**
	 * 部门级报表查询
	 * @param depName 部门名称 空表示查询所有 ，否则只能传一个部门
	 * @param beginDate
	 * @param endDate
	 * @return
	 */
	public  List<DepartmentReport>  queryReportByDepartment(String depName,String beginDate,String endDate);
	

	/**
	 * 收文报表统计
	 * @param depName
	 * @param flowName
	 * @param flowStatus
	 * @param beginDate
	 * @param endDate
	 * @return
	 */
	public List<ReceiveReport> queryReportByReceive(String depName,String flowName,String flowStatus,String beginDate,String endDate,String overDateFlag);
	
	/**
	 * 发文明细报表统计
	 * @param depName
	 * @param flowName
	 * @param flowStatus  1表示没完成，2表示完成，空表示全部
	 * @param beginDate
	 * @param endDate
	 * @param overDateFlag 空表示全部， 1表示超過3
	 * @return
	 */
	public List<SendReport> queryReportBySend(String depName,String flowName,String flowStatus,String beginDate,String endDate,String overDateFlag);
	/**
	 * list中的数据以Excel的形式输出--公司级
	 * @param list
	 * @return
	 */
	public InputStream  listToCompExcel(List<ComPanyReport> list,String beginDate,String endDate,String staticsDate);
	/**
	 * list中的数据以Excel的形式输出--部门级
	 * @param list
	 * @param beginDate
	 * @param endDate
	 * @param staticsDate
	 * @return
	 */
	public InputStream  listToDeptExcel(List<DepartmentReport> list,String depName,String beginDate,String endDate,String staticsDate);
	/**
	 * ist中的数据以Excel的形式输出--收文统计报表
	 * @param list
	 * @param beginDate
	 * @param endDate
	 * @param staticsDate
	 * @return
	 */
	public InputStream  listToReceiveExcel(List<ReceiveReport> list,String beginDate,String endDate,String staticsDate);
	
	/**
	 * ist中的数据以Excel的形式输出--收文统计报表
	 * @param list
	 * @param beginDate
	 * @param endDate
	 * @param staticsDate
	 * @return
	 */
	public InputStream  listToRSendExcel(List<SendReport> list,String beginDate,String endDate,String staticsDate);
	
	/**
	 * 公司级超时报表查询
	 * add by jasonhe
	 * @param beginDate
	 * @param endDate
	 * @return
	 */
	List<ComPanyReport> queryReportByCompanyStep(String beginDate,String endDate);
	
	/**
	 * 导出公司级别超时报表
	 */
	InputStream listToCompStepExcel(List<ComPanyReport> list, String beginDate, String endDate, String staticsDate);
	
	/**
	 * 发文报表统计
	 * @param depName
	 * @param flowName
	 * @param flowStatus
	 * @param beginDate
	 * @param endDate
	 * @return
	 */
	public List<ReceiveReport> queryReportStepBySend(String depName,String flowName,String flowStatus,String beginDate,String endDate,String overDateFlag);
	
	/**
	 * 导出发文超时统计报表
	 */
	public InputStream listToSendStepExcel(List<ReceiveReport> list, String beginDate, String endDate, String staticsDate);
	
	/**
	 * 收文报表统计
	 * @param depName
	 * @param flowName
	 * @param flowStatus
	 * @param beginDate
	 * @param endDate
	 * @return
	 */
	public List<ReceiveReport> queryReportStepByReceive(String depName,String flowName,String flowStatus,String beginDate,String endDate,String overDateFlag);
	
	/**
	 * 导出收文超时统计报表
	 */
	public InputStream listToReceiveStepExcel(List<ReceiveReport> list, String beginDate, String endDate, String staticsDate);
}
