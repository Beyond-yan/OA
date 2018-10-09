package com.gdssoft.oa.service.document;

/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
 *  Copyright (C)
*/
import java.util.List;

import com.gdssoft.oa.model.document.DocFolder;
import com.gdssoft.core.service.BaseService;

public interface DocFolderService extends BaseService<DocFolder>{
	/**
	 * 按父Id取得某目录下的所有子文件夹
	 * @param userId
	 * @param parentId
	 * @return
	 */
	public List<DocFolder> getUserFolderByParentId(Long userId,Long parentId);
	
	/**
	 * 取得某path下的所有Folder
	 * @param path
	 * @return
	 */
	public List<DocFolder> getFolderLikePath(String path);
	/**
	 * 获取公共文件夹
	 * @param userId
	 * @param parentId
	 * @return
	 */
	public List<DocFolder> getPublicFolderByParentId(Long parentId);
}


