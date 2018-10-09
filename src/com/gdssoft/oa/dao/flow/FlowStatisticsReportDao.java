package com.gdssoft.oa.dao.flow;

import java.util.Date;
import java.util.List;
import com.gdssoft.core.dao.BaseDao;
import com.gdssoft.oa.model.reports.ComPanyReport;
import com.gdssoft.oa.model.reports.DepartmentReport;
import com.gdssoft.oa.model.reports.ReceiveReport;
import com.gdssoft.oa.model.reports.SendReport;
/**
 * 
 * @author F3222507
 *
 */
public interface FlowStatisticsReportDao extends BaseDao<Object>{
	public List<Object> getAll(final Date beginDate,final Date endDate);
	/**
	 * 公司级报表查询
	 * @param beginDate
	 * @param endDate
	 * @return
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
	 * 收文明细报表统计
	 * @param depName
	 * @param flowName
	 * @param flowStatus
	 * @param beginDate
	 * @param endDate
	 * @param overDateFlag
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
	 * 公司级超时报表查询
	 * add by jasonhe
	 * @param beginDate
	 * @param endDate
	 * @return
	 */
	List<ComPanyReport> queryReportByCompanyStep(String beginDate,String endDate);
	
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
	 * 收文报表统计
	 * @param depName
	 * @param flowName
	 * @param flowStatus
	 * @param beginDate
	 * @param endDate
	 * @return
	 */
	public List<ReceiveReport> queryReportStepByReceive(String depName,String flowName,String flowStatus,String beginDate,String endDate,String overDateFlag);
	
}
