package com.gdssoft.oa.service.summary;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import java.util.List;

import com.gdssoft.core.service.BaseService;
import com.gdssoft.core.web.paging.PagingBean;
import com.gdssoft.oa.model.summary.WorkSummarySum;
import com.gdssoft.oa.model.system.AppUser;

public interface WorkSummarySumService extends BaseService<WorkSummarySum>{
	public void authorizedSummary(Long id);
	public List<WorkSummarySum> getbyauth(AppUser user,PagingBean pb);
}


