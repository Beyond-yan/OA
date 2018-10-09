package com.gdssoft.oa.dao.archive.impl;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import org.apache.commons.lang.StringUtils;
import org.hibernate.Query;

import com.gdssoft.oa.dao.archive.ArchivesDocDao;
import com.gdssoft.oa.model.archive.Archives;
import com.gdssoft.oa.model.archive.ArchivesDoc;
import com.gdssoft.oa.model.system.FileAttach;
import com.gdssoft.core.Constants;
import com.gdssoft.core.dao.impl.BaseDaoImpl;

public class ArchivesDocDaoImpl extends BaseDaoImpl<ArchivesDoc> implements ArchivesDocDao{

	public ArchivesDocDaoImpl() {
		super(ArchivesDoc.class);
	}

	@Override
	public List<ArchivesDoc> findByAid(Long archivesId) {
		String hql="from ArchivesDoc vo where vo.archives.archivesId=?";
		Object [] objs={archivesId};
		return findByHql(hql, objs);
	}
	public List<ArchivesDoc> findByArchivesId(String hostUrl,Long archivesId,String schema) {
		String sql = "select ad.DOCID,ad.DOCNAME,ad.DOCPATH,ad.CURVERSION,ad.CREATOR from " + schema+".ARCHIVES_DOC ad where ad.ARCHIVESID="+archivesId;
		Query q = this.getSession().createSQLQuery(sql);
		List list = q.list();
		List<ArchivesDoc> archivesDocs=new ArrayList<ArchivesDoc>();
		for(int i=0;i<list.size();i++){
			Object[] objs = (Object[])list.get(i);
			ArchivesDoc archivesDoc = new ArchivesDoc();
			archivesDoc.setDocId(new Long(objs[0].toString()));
			archivesDoc.setDocName(objs[1].toString());
			archivesDoc.setDocPath(hostUrl+objs[2].toString());
			archivesDoc.setCurVersion(new Integer(objs[3].toString()));
			//archivesDoc.setCreator(objs[4].toString());
			archivesDocs.add(archivesDoc);
		}
		return archivesDocs;
	}

	@Override
	public List getDocByArchivesId(String schemaCode, Long archivesId) {
		if(StringUtils.isNotBlank(schemaCode)) schemaCode = schemaCode + ".";
		String sql = "select FileId from " + schemaCode + "archives_doc where archivesId = :archivesId";
		Query query = this.getSession().createSQLQuery(sql).setParameter("archivesId", archivesId);
		List list = query.list();
		return list;
	}
}