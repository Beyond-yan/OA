package com.gdssoft.oa.dao.summary;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import com.gdssoft.core.command.QueryFilter;
import com.gdssoft.core.dao.BaseDao;
import com.gdssoft.oa.model.summary.WorkSummary;
import com.gdssoft.core.web.paging.PagingBean;
import com.gdssoft.oa.model.system.AppUser;
/**
 * 
 * @author 
 *
 */
public interface WorkSummaryDao extends BaseDao<WorkSummary>{
	public List listbyDept(WorkSummary worksummary,PagingBean pb);	
	public List<WorkSummary> getAll(HttpServletRequest request,QueryFilter queryFilter);
	public void authorizedSummary(WorkSummary workSummary);
	public List<WorkSummary> getbyauth(AppUser user,PagingBean pb);
}