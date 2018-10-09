package com.gdssoft.oa.service.law.impl;
import com.gdssoft.core.service.impl.BaseServiceImpl;
import com.gdssoft.oa.dao.law.LawsAuthorDao;
import com.gdssoft.oa.model.law.LawsAuthor;
import com.gdssoft.oa.service.law.LawsAuthorService;


public class LawsAuthorServiceImpl extends BaseServiceImpl<LawsAuthor> implements LawsAuthorService{

	private LawsAuthorDao lawsAuthorDao;
	public LawsAuthorServiceImpl(LawsAuthorDao dao) {
		super(dao);
		lawsAuthorDao=dao;
	}

}
