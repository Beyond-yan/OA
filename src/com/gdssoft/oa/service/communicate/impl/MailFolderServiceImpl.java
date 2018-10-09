package com.gdssoft.oa.service.communicate.impl;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
 *  Copyright (C)
*/
import java.util.List;

import com.gdssoft.oa.dao.communicate.MailFolderDao;
import com.gdssoft.oa.model.communicate.MailFolder;
import com.gdssoft.oa.model.document.DocFolder;
import com.gdssoft.oa.service.communicate.MailFolderService;
import com.gdssoft.core.service.impl.BaseServiceImpl;

public class MailFolderServiceImpl extends BaseServiceImpl<MailFolder> implements MailFolderService{
	private MailFolderDao dao;
	
	public MailFolderServiceImpl(MailFolderDao dao) {
		super(dao);
		this.dao=dao;
	}

	@Override
	public List<MailFolder> getUserFolderByParentId(Long curUserId,Long parentId) {
		
		return dao.getUserFolderByParentId(curUserId, parentId);
	}

	@Override
	public List<MailFolder> getAllUserFolderByParentId(Long userId,
			Long parentId) {
		return dao.getAllUserFolderByParentId(userId,parentId);
	}

	@Override
	public List<MailFolder> getFolderLikePath(String path) {
		return dao.getFolderLikePath(path);
	}

	

}