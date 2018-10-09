package com.gdssoft.oa.service.duty.impl;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import com.gdssoft.core.service.impl.BaseServiceImpl;
import com.gdssoft.oa.dao.duty.DutySignRecordDao;
import com.gdssoft.oa.model.duty.DutySignRecord;
import com.gdssoft.oa.service.duty.DutySignRecordService;

public class DutySignRecordServiceImpl extends BaseServiceImpl<DutySignRecord> implements DutySignRecordService{
	@SuppressWarnings("unused")
	private DutySignRecordDao dao;
	
	public DutySignRecordServiceImpl(DutySignRecordDao dao) {
		super(dao);
		this.dao=dao;
	}

}