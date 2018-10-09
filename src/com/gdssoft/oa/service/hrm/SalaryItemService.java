package com.gdssoft.oa.service.hrm;
/*
 * 捷达世软件(深圳)有限公司 OA办公管理系统 
 *  Copyright (C)
*/
import java.util.List;

import com.gdssoft.oa.model.hrm.SalaryItem;
import com.gdssoft.core.service.BaseService;
import com.gdssoft.core.web.paging.PagingBean;

public interface SalaryItemService extends BaseService<SalaryItem>{

	public List<SalaryItem> getAllExcludeId(String excludeIds,PagingBean pb);
	
}


