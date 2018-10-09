package com.gdssoft.oa.service.law.impl;

import com.gdssoft.core.service.impl.BaseServiceImpl;
import com.gdssoft.oa.dao.law.LawsDao;
import com.gdssoft.oa.model.law.Laws;
import com.gdssoft.oa.service.law.LawsService;

public class LawsServiceImpl extends BaseServiceImpl<Laws> implements LawsService{
 
	private LawsDao dao;
	public LawsServiceImpl(LawsDao dao) {
		super(dao);
		this.dao=dao;
	}

}
