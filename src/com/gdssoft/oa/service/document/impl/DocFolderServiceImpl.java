package com.gdssoft.oa.service.document.impl;
/*
 * 捷达世软件(深圳)有限公司 OA办公管理系统 
 *  Copyright (C)
*/
import java.util.List;

import com.gdssoft.oa.dao.document.DocFolderDao;
import com.gdssoft.oa.model.document.DocFolder;
import com.gdssoft.oa.service.document.DocFolderService;
import com.gdssoft.core.service.impl.BaseServiceImpl;

public class DocFolderServiceImpl extends BaseServiceImpl<DocFolder> implements DocFolderService{
	private DocFolderDao dao;
	
	public DocFolderServiceImpl(DocFolderDao dao) {
		super(dao);
		this.dao=dao;
	}
	
	public List<DocFolder> getUserFolderByParentId(Long userId,Long parentId){
		return dao.getUserFolderByParentId(userId, parentId);
	}
	
	/**
	 * 取得某path下的所有Folder
	 * @param path
	 * @return
	 */
	public List<DocFolder> getFolderLikePath(String path){
		return dao.getFolderLikePath(path);
	}

	@Override
	public List<DocFolder> getPublicFolderByParentId(Long parentId) {
		return dao.getPublicFolderByParentId( parentId);
	}

}