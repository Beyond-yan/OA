package com.gdssoft.oa.service.law.impl;

import com.gdssoft.core.service.impl.BaseServiceImpl;
import com.gdssoft.oa.dao.law.LawsTypeDao;
import com.gdssoft.oa.model.law.LawsType;
import com.gdssoft.oa.service.law.LawsTypeService;

public class LawsTypeServiceImpl extends BaseServiceImpl<LawsType> implements LawsTypeService{

	private LawsTypeDao lawsTypeDao;
	public LawsTypeServiceImpl(LawsTypeDao dao) {
		super(dao);
		lawsTypeDao=dao;
	}

}
