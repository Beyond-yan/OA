package com.gdssoft.oa.dao.summary;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import java.util.List;

import com.gdssoft.core.dao.BaseDao;
import com.gdssoft.core.web.paging.PagingBean;
import com.gdssoft.oa.model.summary.WorkSummary;
import com.gdssoft.oa.model.summary.WorkSummarySum;
import com.gdssoft.oa.model.system.AppUser;

/**
 * 
 * @author 
 *
 */
public interface WorkSummarySumDao extends BaseDao<WorkSummarySum>{
	public void authorizedSummary(WorkSummarySum workSummarySum);
	public List<WorkSummarySum> getbyauth(AppUser user,PagingBean pb);
}