package com.gdssoft.oa.service.personal.impl;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import com.gdssoft.core.service.impl.BaseServiceImpl;
import com.gdssoft.oa.dao.personal.PersonnelLeaveApplyDao;
import com.gdssoft.oa.model.personal.PersonnelLeaveApply;
import com.gdssoft.oa.service.personal.PersonnelLeaveApplyService;

public class PersonnelLeaveApplyServiceImpl extends BaseServiceImpl<PersonnelLeaveApply> implements PersonnelLeaveApplyService{
	@SuppressWarnings("unused")
	private PersonnelLeaveApplyDao dao;
	
	public PersonnelLeaveApplyServiceImpl(PersonnelLeaveApplyDao dao) {
		super(dao);
		this.dao=dao;
	}

}