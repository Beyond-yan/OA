package com.gdssoft.oa.dao.document;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import java.util.List;

import com.gdssoft.oa.model.document.DocPrivilege;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.core.dao.BaseDao;
import com.gdssoft.core.web.paging.PagingBean;

/**
 * 
 * @author 
 *
 */
public interface DocPrivilegeDao extends BaseDao<DocPrivilege>{
	
	/**
	 * 获取全部权限
	 * @param docPrivilege
	 * @param folderId
	 * @param pb
	 * @return
	 */
	public List<DocPrivilege> getAll(DocPrivilege docPrivilege,Long folderId,PagingBean pb);
	/**
	 * 获取某个人的全部公共文档权限
	 * @param docPrivilege
	 * @param urdId
	 * @return
	 */
	public List<DocPrivilege> getByPublic(DocPrivilege docPrivilege,Long urdId);
	/**
	 * 获取单个文件夹的权限数组
	 * @param user
	 * @param folderId
	 * @return
	 */
	public List<Integer> getRightsByFolder(AppUser user, Long folderId);
	/**
	 * 根据个人来获取文档的权限
	 * @param user
	 * @param docId
	 * @return
	 */
	public Integer getRightsByDocument(AppUser user,Long docId);
	/**
	 * 获取权限个数
	 */
	public Integer countPrivilege();
}