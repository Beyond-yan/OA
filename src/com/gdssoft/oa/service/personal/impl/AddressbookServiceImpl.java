package com.gdssoft.oa.service.personal.impl;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import com.gdssoft.core.service.impl.BaseServiceImpl;
import com.gdssoft.oa.dao.personal.AddressbookDao;
import com.gdssoft.oa.model.personal.Addressbook;
import com.gdssoft.oa.service.personal.AddressbookService;

public class AddressbookServiceImpl extends BaseServiceImpl<Addressbook> implements AddressbookService{
	@SuppressWarnings("unused")
	private AddressbookDao dao;
	
	public AddressbookServiceImpl(AddressbookDao dao) {
		super(dao);
		this.dao=dao;
	}

}