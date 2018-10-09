package com.gdssoft.oa.dao.system.impl;

import com.gdssoft.core.dao.impl.BaseDaoImpl;
import com.gdssoft.oa.dao.system.DocFileListDao;
import com.gdssoft.oa.model.system.DocDirectory;
import com.gdssoft.oa.model.system.DocFileList;

public class DocFileListDaoImpl extends BaseDaoImpl<DocFileList> implements DocFileListDao{
	public DocFileListDaoImpl() {
		super(DocFileList.class);
	}
}
