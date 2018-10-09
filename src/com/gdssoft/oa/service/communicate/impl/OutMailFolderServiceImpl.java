package com.gdssoft.oa.service.communicate.impl;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
 *  Copyright (C)
*/
import java.util.List;

import com.gdssoft.oa.dao.communicate.OutMailFolderDao;
import com.gdssoft.oa.model.communicate.MailFolder;
import com.gdssoft.oa.model.communicate.OutMailFolder;
import com.gdssoft.oa.service.communicate.OutMailFolderService;
import com.gdssoft.core.service.impl.BaseServiceImpl;

public class OutMailFolderServiceImpl extends BaseServiceImpl<OutMailFolder> implements OutMailFolderService{
	private OutMailFolderDao dao;
	
	public OutMailFolderServiceImpl(OutMailFolderDao dao) {
		super(dao);
		this.dao=dao;
	}
	@Override
	public List<OutMailFolder> getAllUserFolderByParentId(Long userId,
			Long parentId) {
		return dao.getAllUserFolderByParentId(userId,parentId);
	}
	@Override
	public List<OutMailFolder> getUserFolderByParentId(Long userId,Long parentId){
		return dao.getUserFolderByParentId(userId,parentId);
	}
	@Override
	public List<OutMailFolder> getFolderLikePath(String path){
		return dao.getFolderLikePath(path);
	}

}