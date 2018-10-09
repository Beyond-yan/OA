package com.gdssoft.oa.service.summary;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import com.gdssoft.core.command.QueryFilter;
import com.gdssoft.core.service.BaseService;
import com.gdssoft.core.web.paging.PagingBean;
import com.gdssoft.oa.model.summary.WorkSummary;
import com.gdssoft.oa.model.system.AppUser;

public interface WorkSummaryService extends BaseService<WorkSummary>{
	public List listbyDept(WorkSummary worksummary,PagingBean pb);
	
	public List<WorkSummary> getAll(HttpServletRequest requestr,QueryFilter queryFilter);
	public void authorizedSummary(Long id,String isAuthorized);
	public List<WorkSummary> getbyauth(AppUser user,PagingBean pb);
	
}


