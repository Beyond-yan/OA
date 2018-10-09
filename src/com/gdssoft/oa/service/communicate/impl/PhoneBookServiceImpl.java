package com.gdssoft.oa.service.communicate.impl;
/*
 *捷达世软件(深圳)有限公司 OA办公管理系统 
 *  Copyright (C)
*/
import java.util.List;

import com.gdssoft.oa.dao.communicate.PhoneBookDao;
import com.gdssoft.oa.model.communicate.PhoneBook;
import com.gdssoft.oa.service.communicate.PhoneBookService;
import com.gdssoft.core.service.impl.BaseServiceImpl;
import com.gdssoft.core.web.paging.PagingBean;

public class PhoneBookServiceImpl extends BaseServiceImpl<PhoneBook> implements PhoneBookService{
	private PhoneBookDao dao;
	
	public PhoneBookServiceImpl(PhoneBookDao dao) {
		super(dao);
		this.dao=dao;
	}

	@Override
	public List<PhoneBook> sharedPhoneBooks(String fullname, String ownerName,
			PagingBean pb) {
		return dao.sharedPhoneBooks(fullname, ownerName, pb);
	}

}