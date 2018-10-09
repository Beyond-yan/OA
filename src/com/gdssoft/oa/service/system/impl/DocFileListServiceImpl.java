package com.gdssoft.oa.service.system.impl;

import com.gdssoft.core.service.impl.BaseServiceImpl;
import com.gdssoft.oa.dao.system.DocFileListDao;
import com.gdssoft.oa.model.system.DocFileList;
import com.gdssoft.oa.service.system.DocFileListService;

public class DocFileListServiceImpl extends BaseServiceImpl<DocFileList> implements DocFileListService{
	private DocFileListDao dao;
	public DocFileListServiceImpl(DocFileListDao dao) {
		super(dao);
		this.dao=dao;
	}
	
}
