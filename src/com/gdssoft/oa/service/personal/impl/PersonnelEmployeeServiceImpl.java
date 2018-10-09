package com.gdssoft.oa.service.personal.impl;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import com.gdssoft.core.service.impl.BaseServiceImpl;
import com.gdssoft.oa.dao.personal.PersonnelEmployeeDao;
import com.gdssoft.oa.model.personal.PersonnelEmployee;
import com.gdssoft.oa.service.personal.PersonnelEmployeeService;

public class PersonnelEmployeeServiceImpl extends BaseServiceImpl<PersonnelEmployee> implements PersonnelEmployeeService{
	@SuppressWarnings("unused")
	private PersonnelEmployeeDao dao;
	
	public PersonnelEmployeeServiceImpl(PersonnelEmployeeDao dao) {
		super(dao);
		this.dao=dao;
	}	


	@Override
	public void gupdate(String uID, String officephone, String ext,
			String shortphone, String room,int isLeader,int isWorkTel)
	{
		dao.gupdate(uID, officephone, ext, shortphone, room, isLeader, isWorkTel);		
	}


	@Override
	public void delByUserId(Long uID)
	{
		dao.delByUserId(uID);		
	}


	@Override
	public PersonnelEmployee getByUserID(String uID)
	{
		return dao.getByUserID(uID);
	}


}