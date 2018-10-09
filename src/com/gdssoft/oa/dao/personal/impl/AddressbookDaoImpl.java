package com.gdssoft.oa.dao.personal.impl;

import com.gdssoft.core.dao.impl.BaseDaoImpl;
import com.gdssoft.oa.dao.personal.AddressbookDao;
import com.gdssoft.oa.model.personal.Addressbook;

@SuppressWarnings("unchecked")
public class AddressbookDaoImpl extends BaseDaoImpl<Addressbook> implements
		AddressbookDao {

	public AddressbookDaoImpl() {
		super(Addressbook.class);
	}

}
