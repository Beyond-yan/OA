package com.gdssoft.oa.service.hrm.impl;
/*
 * 捷达世软件(深圳)有限公司 OA办公管理系统 
 *  Copyright (C)
*/
import java.util.List;

import com.gdssoft.oa.dao.hrm.SalaryItemDao;
import com.gdssoft.oa.model.hrm.SalaryItem;
import com.gdssoft.oa.service.hrm.SalaryItemService;
import com.gdssoft.core.service.impl.BaseServiceImpl;
import com.gdssoft.core.web.paging.PagingBean;

public class SalaryItemServiceImpl extends BaseServiceImpl<SalaryItem> implements SalaryItemService{
	private SalaryItemDao dao;
	
	public SalaryItemServiceImpl(SalaryItemDao dao) {
		super(dao);
		this.dao=dao;
	}

	@Override
	public List<SalaryItem> getAllExcludeId(String excludeIds,PagingBean pb) {
		return dao.getAllExcludeId(excludeIds,pb);
	}

}