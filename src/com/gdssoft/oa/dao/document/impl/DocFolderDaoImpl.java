package com.gdssoft.oa.dao.document.impl;
/*
 * 捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import java.util.List;

import com.gdssoft.oa.dao.document.DocFolderDao;
import com.gdssoft.oa.model.document.DocFolder;
import com.gdssoft.core.dao.impl.BaseDaoImpl;

public class DocFolderDaoImpl extends BaseDaoImpl<DocFolder> implements DocFolderDao{

	public DocFolderDaoImpl() {
		super(DocFolder.class);
	}
	
	/**
	 * 取得某用户对应的所有文件夹
	 * @param userId
	 * @param parentId
	 * @return
	 */
	public List<DocFolder> getUserFolderByParentId(Long userId,Long parentId){
		
		String hql="from DocFolder df where df.isShared=0 and df.appUser.userId=? and parentId=?";
		return findByHql(hql, new Object[]{userId,parentId});
	}
	/**
	 * 取得某path下的所有Folder
	 * @param path
	 * @return
	 */
	public List<DocFolder> getFolderLikePath(String path){
		String hql="from DocFolder df where df.path like ?";
		return findByHql(hql,new Object[]{path+'%'});
	}

	@Override
	public List<DocFolder> getPublicFolderByParentId(Long parentId) {
        String hql="from DocFolder df where df.isShared=1 and parentId=? ";
		return findByHql(hql, new Object[]{parentId});
	}

}