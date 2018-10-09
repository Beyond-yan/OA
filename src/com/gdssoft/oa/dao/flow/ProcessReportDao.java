package com.gdssoft.oa.dao.flow;

import java.text.ParseException;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import com.gdssoft.core.command.QueryFilter;
import com.gdssoft.core.dao.BaseDao;
import com.gdssoft.oa.model.flow.ProcessReport;

public interface ProcessReportDao extends BaseDao<ProcessReport> {
	
	/**
	 * 部门管理员查询部门所有流程
	 * @param request 参数传递
	 * @param queryFilter 查询过滤
	 * @return ProcessReport实体对象列表
	 */
	public List<ProcessReport> getallauth(HttpServletRequest request,QueryFilter queryFilter) throws ParseException;

	
	/**
	 * 普通员工查询个人所有流程
	 * @param request 参数传递
	 * @param queryFilter 查询过滤
	 * @return ProcessReport实体对象列表
	 */
	public List<ProcessReport> getallauthUser(HttpServletRequest request,
			QueryFilter queryFilter);

	/**
	 * 超级管理员查询所有流程
	 * @param request 参数传递
	 * @param queryFilter 查询过滤
	 * @return ProcessReport实体对象列表
	 */
	public List<ProcessReport> getallauthAdmin(HttpServletRequest request,
			QueryFilter queryFilter);
	
	
	public List<ProcessReport> getAllProcessList(final int userType,final String userId,HttpServletRequest request,
			QueryFilter queryFilter);


	Boolean testList();
}
