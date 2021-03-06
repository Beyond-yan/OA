package com.gdssoft.oa.service.hrm.impl;
/*
 * 捷达世软件(深圳)有限公司 OA办公管理系统 
 *  Copyright (C)
*/
import java.util.List;

import com.gdssoft.oa.dao.hrm.StandSalaryItemDao;
import com.gdssoft.oa.model.hrm.StandSalaryItem;
import com.gdssoft.oa.service.hrm.StandSalaryItemService;
import com.gdssoft.core.service.impl.BaseServiceImpl;

public class StandSalaryItemServiceImpl extends BaseServiceImpl<StandSalaryItem> implements StandSalaryItemService{
	private StandSalaryItemDao dao;
	
	public StandSalaryItemServiceImpl(StandSalaryItemDao dao) {
		super(dao);
		this.dao=dao;
	}

	@Override
	public List<StandSalaryItem> getAllByStandardId(Long standardId) {
		return dao.getAllByStandardId(standardId);
	}

}