package com.gdssoft.oa.dao.system.impl;

import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.hibernate.Query;

import com.gdssoft.core.dao.impl.BaseDaoImpl;
import com.gdssoft.core.util.ContextUtil;
import com.gdssoft.oa.dao.system.DocDirectoryDao;
import com.gdssoft.oa.model.system.Department;
import com.gdssoft.oa.model.system.DocDirectory;

public class DocDirectoryDaoImpl extends BaseDaoImpl<DocDirectory> implements DocDirectoryDao {

	public DocDirectoryDaoImpl() {
		//super(DocDirectoryDao.class);
		super(DocDirectory.class);
	}

	@Override
	public List<DocDirectory> findByParentId(Long parentId) {
		final String hql = "from DocDirectory d where d.parentId=?";
		Object[] params ={parentId};
		return findByHql(hql, params);
	}

	public List<DocDirectory> findByDeptId(Long deptId) {
		String hql = "from DocDirectory d where d.deptId=?" ;
		Object[] params ={deptId};
		return findByHql(hql,params);
		
 	}
	
	public Double getTotalBytes(DocDirectory docDirectory) {
		String schemaName= "";
		if(null != ContextUtil.getCurrentUser()){
    		if(!StringUtils.isBlank(ContextUtil.getCurrentUser().getOwnerSchema()))
    			schemaName = ContextUtil.getCurrentUser().getOwnerSchema()+".";
		}
		
		String sql = "select sum(f.totalbytes) from "+schemaName+"cq_doc_directory cdd "
						+ "left join "+schemaName+"cq_doc_files d on cdd.id = d.directory_id "
						+ "left join "+schemaName+"cq_doc_files_attach df on df.doc_files_id = d.id "
						+ "left join "+schemaName+"file_attach f on f.fileid = df.file_id "
						+ " where 1=1 ";
		if (docDirectory.getId() != null && docDirectory.getId() > 0) {
			sql += " and cdd.id = :id ";
		}
		if (docDirectory.getDirectoryName() != null && docDirectory.getDirectoryName().length() > 0) {
			sql += " and cdd.directory_name like '%" + docDirectory.getDirectoryName() + "%' ";
		}
		if (docDirectory.getRetentionYear() > 0) {
			sql += " and cdd.retention_year = :retentionYear ";
		}
		if (docDirectory.getDirYear() > 0) {
			sql += " and cdd.dir_year = :dirYear ";
		}
		if (docDirectory.getDepartment() != null 
				&& docDirectory.getDepartment().getDepId() != null
				&& docDirectory.getDepartment().getDepId() > 0) {
			sql += " and cdd.dept_id = :depId ";
		}
		Query query = this.getSession().createSQLQuery(sql);
		if (docDirectory.getId() != null && docDirectory.getId() > 0) {
			query.setParameter("id", docDirectory.getId());
		}
		if (docDirectory.getRetentionYear() > 0) {
			query.setParameter("retentionYear", docDirectory.getRetentionYear());
		}
		if (docDirectory.getDirYear() > 0) {
			query.setParameter("dirYear", docDirectory.getDirYear());
		}
		if (docDirectory.getDepartment() != null 
				&& docDirectory.getDepartment().getDepId() != null
				&& docDirectory.getDepartment().getDepId() > 0) {
			query.setParameter("depId", docDirectory.getDepartment().getDepId());
		}
		List list = query.list();
		if(list.size()>0 && list.get(0) != null){
			return new Double(list.get(0).toString());
		}
		
		return 0D;
	}
}
