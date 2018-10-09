package com.gdssoft.oa.util;

import org.apache.log4j.Logger;

import com.google.common.collect.Interner;
import com.google.common.collect.Interners;

public class SyncUtil {

	public static final Logger customerLog = Logger.getLogger("customer");
	
	public static final Interner<String> pool = Interners.newWeakInterner();

	public static final String SYNC_NEXT_PROCESS_FLAG = "NEXT_PROCESS_";
}
