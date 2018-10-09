package com.gdssoft.oa.dao.communicate.impl;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import java.util.List;

import com.gdssoft.oa.dao.communicate.OutMailFolderDao;
import com.gdssoft.oa.model.communicate.MailFolder;
import com.gdssoft.oa.model.communicate.OutMailFolder;
import com.gdssoft.core.dao.impl.BaseDaoImpl;

public class OutMailFolderDaoImpl extends BaseDaoImpl<OutMailFolder> implements OutMailFolderDao{

	public OutMailFolderDaoImpl() {
		super(OutMailFolder.class);
	}
	/**
	 * 根据用户ID,或文件夹ParentID,或用户ID为空取得文件夹
	 * 取得MailFolder第一层文件夹,包括收件箱,发件箱,草稿箱,删除箱
	 */
	@Override
	public List<OutMailFolder> getAllUserFolderByParentId(Long userId,Long parentId) {
		String hql = "from OutMailFolder mf where mf.appUser.userId=? and parentId=? or userId is null";
		return findByHql(hql, new Object[]{userId, parentId});
		
	}
	
	/**
	 * 根据用户ID,或文件夹ParentID取得文件夹
	 */
	@Override
	public List<OutMailFolder> getUserFolderByParentId(Long userId, Long parentId) {
		String hql = "from OutMailFolder mf where mf.appUser.userId=? and parentId=?";
		return findByHql(hql, new Object[]{userId, parentId});
	}
	
	/**
	 * 取得某path下的所有Folder
	 * @param path
	 * @return
	 */
	@Override
	public List<OutMailFolder> getFolderLikePath(String path) {
		String hql="from OutMailFolder mf where mf.path like ?";
		return findByHql(hql,new Object[]{path+'%'});
	}
	

}