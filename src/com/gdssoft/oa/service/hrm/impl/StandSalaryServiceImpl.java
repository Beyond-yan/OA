package com.gdssoft.oa.service.hrm.impl;
/*
 *捷达世软件(深圳)有限公司 OA办公管理系统 
 *  Copyright (C)
*/
import java.util.List;

import com.gdssoft.oa.dao.hrm.StandSalaryDao;
import com.gdssoft.oa.model.hrm.StandSalary;
import com.gdssoft.oa.service.hrm.StandSalaryService;
import com.gdssoft.core.service.impl.BaseServiceImpl;

public class StandSalaryServiceImpl extends BaseServiceImpl<StandSalary> implements StandSalaryService{
	private StandSalaryDao dao;
	
	public StandSalaryServiceImpl(StandSalaryDao dao) {
		super(dao);
		this.dao=dao;
	}

	@Override
	public boolean checkStandNo(String standardNo) {
		return dao.checkStandNo(standardNo);
	}

	@Override
	public List<StandSalary> findByPassCheck() {
		return dao.findByPassCheck();
	}

}