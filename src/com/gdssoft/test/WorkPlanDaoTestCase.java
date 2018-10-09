package com.gdssoft.test;

import javax.annotation.Resource;

import org.junit.Test;

import com.gdssoft.oa.job.ArchivesJob;
import com.gdssoft.oa.service.point.UserContactsService;

public class WorkPlanDaoTestCase extends BaseTestCase {
	@Resource
	private UserContactsService userContactsService;
	@Test
	public void add(){{ 
		ArchivesJob  archivesJob= new ArchivesJob();
		archivesJob.sentReceiveArchive();
	}
}}