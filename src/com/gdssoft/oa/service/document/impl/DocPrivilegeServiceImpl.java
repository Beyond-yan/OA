package com.gdssoft.oa.service.document.impl;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
 *  Copyright (C)
*/
import java.util.List;

import com.gdssoft.oa.dao.document.DocPrivilegeDao;
import com.gdssoft.oa.model.document.DocPrivilege;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.oa.service.document.DocPrivilegeService;
import com.gdssoft.core.service.impl.BaseServiceImpl;
import com.gdssoft.core.web.paging.PagingBean;

public class DocPrivilegeServiceImpl extends BaseServiceImpl<DocPrivilege> implements DocPrivilegeService{
	private DocPrivilegeDao dao;
	
	public DocPrivilegeServiceImpl(DocPrivilegeDao dao) {
		super(dao);
		this.dao=dao;
	}

	@Override
	public List<DocPrivilege> getAll(DocPrivilege docPrivilege,Long folderId, PagingBean pb) {
		
		return dao.getAll(docPrivilege,folderId, pb);
	}

	@Override
	public List<Integer> getRightsByFolder(AppUser user, Long folderId) {
		return dao.getRightsByFolder(user, folderId);
	}

	@Override
	public Integer getRightsByDocument(AppUser user, Long docId) {
		return dao.getRightsByDocument(user, docId);
	}

}