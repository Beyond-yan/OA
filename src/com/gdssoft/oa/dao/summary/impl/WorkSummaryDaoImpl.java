package com.gdssoft.oa.dao.summary.impl;

/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
 */
import com.gdssoft.core.command.CriteriaCommand;
import com.gdssoft.core.command.FieldCommandImpl;
import com.gdssoft.core.command.QueryFilter;
import com.gdssoft.core.command.SortCommandImpl;
import com.gdssoft.core.dao.impl.BaseDaoImpl;
import com.gdssoft.core.util.ParamUtil;
import com.gdssoft.core.web.paging.PagingBean;
import com.gdssoft.oa.dao.summary.WorkSummaryDao;
import com.gdssoft.oa.model.document.Document;
import com.gdssoft.oa.model.summary.WorkSummary;
import com.gdssoft.oa.model.system.AppRole;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.oa.model.system.Department;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang.StringUtils;
import org.hibernate.Criteria;
import org.hibernate.HibernateException;
import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.criterion.Projections;
import org.springframework.orm.hibernate3.HibernateCallback;

@SuppressWarnings("unchecked")
public class WorkSummaryDaoImpl extends BaseDaoImpl<WorkSummary> implements
		WorkSummaryDao {

	private ArrayList<Object> paramList = new ArrayList<Object>();

	public WorkSummaryDaoImpl() {
		super(WorkSummary.class);
	}

	public List listbyDept(WorkSummary worksummary, PagingBean pb) {
		List summarylist = null;
		String sqlcond = "where (1=1 ";
		if (worksummary.getTypeNo() > 0) {
			sqlcond = sqlcond + " and B.Type_no=" + worksummary.getTypeNo();
		}
		if (worksummary.getYearNo() > 0) {
			sqlcond = sqlcond + " and B.year_no=" + worksummary.getYearNo();
		}
		if (!"".equals(worksummary.getSummarytype())
				&& worksummary.getSummarytype() != null) {
			sqlcond = sqlcond + " and B.summarytype = '"
					+ worksummary.getSummarytype() + "'";
		}
		sqlcond = sqlcond + ")";
		String sql = "select * from department A "
				+ " left join work_summary B on A.depid=B.deptid " + sqlcond
				+ " or B.summaryid is null ";
		Object[] objlist = null;
		// List docIds=find(sql,objlist,pb);
		summarylist = jdbcTemplate.queryForList(sql);
		return summarylist;
		// return getByIds(docIds);
	}

	/**
	 * 按Ids 来取到所有的列表
	 * 
	 * @param docIds
	 * @return
	 */
	private List<WorkSummary> getByIds(List docIds, PagingBean pb) {

		String docHql = "from DepartmentSummary ds left join ds.summaries s where s.summaryid >0 ";
		StringBuffer sbIds = new StringBuffer();

		for (int i = 0; i < docIds.size(); i++) {
			sbIds.append(docIds.get(i).toString()).append(",");
		}

		if (docIds.size() > 0) {
			sbIds.deleteCharAt(sbIds.length() - 1);
			docHql += sbIds.toString() + ")";
			return (List<WorkSummary>) findByHql(docHql);
		} else {
			return new ArrayList();
		}
	}

	public List<WorkSummary> getAll(final HttpServletRequest request,
			QueryFilter queryFilter) {
		// 设置总记录数
		// QueryFilter queryFilter = new QueryFilter(request);
		String hqlcond = createConditions(request);
		String hql = "from DepartmentSummary dep left join dep.summaries worksum " +
					"where worksum.summaryid is null or (worksum.summaryid>0 ";
		if (hqlcond.length() > 0) {
			hql = hql + hqlcond;
		}
		hql = hql + ")";
		List<WorkSummary> list = findByHql(hql, paramList.toArray(),
				queryFilter.getPagingBean());
		List<WorkSummary> listrtn = null;
		for (int i = 0; i < list.size(); i++) {
			WorkSummary workSummary = list.get(i);
			listrtn.add(workSummary);
		}

		return listrtn;
	}

	private String createConditions(HttpServletRequest request) {
		String hql = "";
		Enumeration paramEnu = request.getParameterNames();
		while (paramEnu.hasMoreElements()) {
			String paramName = (String) paramEnu.nextElement();

			if (paramName.startsWith("Q_")) {
				String paramValue = (String) request.getParameter(paramName);
				hql = getFilter(paramName, paramValue);
			}
		}
		return hql;

	}

	public String getFilter(String paramName, String paramValue) {
		String hqlstr = "";
		String[] fieldInfo = paramName.split("[_]");
		Object value = null;
		if (fieldInfo != null && fieldInfo.length == 4) {
			value = ParamUtil.convertObject(fieldInfo[2], paramValue);
			if (value != null) {
				hqlstr = getPartHql(fieldInfo[1], value.toString(),
						fieldInfo[3]);
			}
		} else if (fieldInfo != null && fieldInfo.length == 3) {
			hqlstr = getPartHql(fieldInfo[1], value.toString(), fieldInfo[2]);
		} else {
			logger.error("Query param name [" + paramName
					+ "] is not right format.");
		}
		return hqlstr;
	}

	public String getPartHql(String property, String value, String operation) {
		// 处理外键的问题
		String[] propertys = property.split("[.]");
		if (propertys != null && propertys.length > 1) {
			if (!"vo".equals(propertys[0])) {// 若第一个字符串不为vo，表示为外键关键，否则还是实体的属性
				// 防止别名重复
			}
		}
		String partHql = "";
		if ("LT".equals(operation)) {
			partHql = " and " + property + " < ? ";
			paramList.add(value);
		} else if ("GT".equals(operation)) {
			partHql = " and " + property + " > ? ";
			paramList.add(value);
		} else if ("LE".equals(operation)) {
			partHql = " and " + property + " <= ? ";
			paramList.add(value);
		} else if ("GE".equals(operation)) {
			partHql = " and " + property + " >= ? ";
			paramList.add(value);
		} else if ("LK".equals(operation)) {
			partHql = " and " + property + " like ? ";
			paramList.add(value);
		} else if ("LFK".equals(operation)) {
			partHql = " and " + property + " like ? ";
			paramList.add(value);
		} else if ("RHK".equals(operation)) {
			partHql = " and " + property + " like ? ";
			paramList.add(value);
		} else if ("NULL".equals(operation)) {
			partHql = " and " + property + " is null ";
			paramList.add(value);
		} else if ("NOTNULL".equals(operation)) {
			partHql = " and " + property + " is not null ";
			paramList.add(value);
		} else if ("EMP".equals(operation)) {
			// TODO
		} else if ("NOTEMP".equals(operation)) {

		} else if ("NEQ".equals(operation)) {
			partHql = " and " + property + " !=? ";
			paramList.add(value);
		} else {
			partHql = " and " + property + " =? ";
			paramList.add(value);
		}

		return partHql;
	}
	public void authorizedSummary(WorkSummary workSummary)
	{
		getHibernateTemplate().update("WorkSummary", workSummary);
	}
	public List<WorkSummary> getbyauth(AppUser user,PagingBean pb)
	{
		List<WorkSummary> list = new ArrayList<WorkSummary>();
		boolean isAdmin = false;
		for (AppRole role : (user.getRoles()).toArray(new AppRole[0])) {
			if (role.getRoleId() == -1L)// 管理员权限
			{
				isAdmin = true;
				break;
			}
		}
		String hql= "";
		String condstr = "";
		hql = "from WorkSummary ws where ws.isAuthorized = 0 ";
		if (!isAdmin)// 非管理员需要过滤所在部门
		{
			if (user.getUserId() == user.getDepartment().getAppUser().getUserId())
			{				
				condstr = " and ws.department.id=? ";	
				hql += condstr;	
				paramList.add(user.getDepartment().getDepId());								
				list = findByHql(hql, paramList.toArray(),pb);
			}
		}
		else
		{
			list = findByHql(hql, paramList.toArray(),pb);
		}						
		return list;
	}
}