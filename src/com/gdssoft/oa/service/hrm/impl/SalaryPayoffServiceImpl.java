package com.gdssoft.oa.service.hrm.impl;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
 *  Copyright (C)
*/
import com.gdssoft.oa.dao.hrm.SalaryPayoffDao;
import com.gdssoft.oa.model.hrm.SalaryPayoff;
import com.gdssoft.oa.service.hrm.SalaryPayoffService;
import com.gdssoft.core.service.impl.BaseServiceImpl;

public class SalaryPayoffServiceImpl extends BaseServiceImpl<SalaryPayoff> implements SalaryPayoffService{
	private SalaryPayoffDao dao;
	
	public SalaryPayoffServiceImpl(SalaryPayoffDao dao) {
		super(dao);
		this.dao=dao;
	}

}