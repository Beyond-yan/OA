package com.gdssoft.oa.service.summary.impl;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import java.util.List;

import com.gdssoft.core.service.impl.BaseServiceImpl;
import com.gdssoft.core.web.paging.PagingBean;
import com.gdssoft.oa.dao.summary.WorkSummarySumDao;
import com.gdssoft.oa.model.summary.WorkSummary;
import com.gdssoft.oa.model.summary.WorkSummarySum;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.oa.service.summary.WorkSummarySumService;

public class WorkSummarySumServiceImpl extends BaseServiceImpl<WorkSummarySum> implements WorkSummarySumService{
	@SuppressWarnings("unused")
	private WorkSummarySumDao dao;
	
	public WorkSummarySumServiceImpl(WorkSummarySumDao dao) {
		super(dao);
		this.dao=dao;
	}
	public void authorizedSummary(Long id)
	{
		 WorkSummarySum workSummarySum = get(id);
		 workSummarySum.setIsAuthorized(1);//1=通过审核
		 dao.authorizedSummary(workSummarySum);
	}
	public List<WorkSummarySum> getbyauth(AppUser user,PagingBean pb)
	{		
		return dao.getbyauth(user, pb);
	}
}